const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    // Set a default timeout for all wait operations
    driver.manage().setTimeouts({ implicit: 30000, pageLoad: 30000, script: 30000 });

    try {
        // Load your Angular application's login page
        await driver.get('http://localhost:4200/login');



        // Wait for the email input field to be located and visible
        let emailField = await driver.wait(until.elementLocated(By.css('input#typeEmailX-2')), 30000);
        await driver.wait(until.elementIsVisible(emailField), 30000);

        // Enter email and password
        await emailField.sendKeys('chief1@example.com');
        let passwordField = await driver.findElement(By.css('input#typePasswordX-2'));
        await driver.wait(until.elementIsVisible(passwordField), 30000);
        await passwordField.sendKeys('password');

        // Click the submit button to log in
        let loginButton = await driver.findElement(By.css('button[type="submit"]'));
        await driver.wait(until.elementIsVisible(loginButton), 30000);
        await loginButton.click();

        // Handle potential login alert
        try {
            let alert = await driver.wait(until.alertIsPresent(), 30000);
            console.log('Alert detected: ' + await alert.getText());
            await alert.accept(); // or alert.dismiss();
        } catch (e) {
            console.log('No alert detected during login');
        }

        // Wait until redirected to the dashboard
        await driver.wait(until.urlContains('/dashboard/home'), 30000);

        // Wait until the dashboard page is fully loaded
        await driver.wait(until.elementLocated(By.css('body')), 30000);

        // Test if location analytics cards are displayed correctly
        let analyticsCards = await driver.findElements(By.css('.card-title strong'));
        for (let card of analyticsCards) {
            let cardText = await card.getText();
            console.log(`Location Card: ${cardText}`);  // Print the location names
            if (!cardText) {
                throw new Error('Analytics card title is missing');
            }
        }

        // Verify each analytics card percentage text
        let cardPercentages = await driver.findElements(By.css('.card-text'));
        for (let percentage of cardPercentages) {
            let percentageText = await percentage.getText();
            console.log(`Percentage: ${percentageText}`);
            if (!percentageText.includes('%')) {
                throw new Error('Percentage text is incorrect or missing');
            }
        }

        // Test if the table loads with the expected columns
        let tableHeaders = await driver.findElements(By.css('table th'));
        let expectedHeaders = ["Title", "Description", "Status", "Team Name", "Reported By", "Details"];
        for (let i = 0; i < tableHeaders.length; i++) {
            let headerText = await tableHeaders[i].getText();
            console.log(`Expected: ${expectedHeaders[i]}, Found: ${headerText}`);
            if (headerText !== expectedHeaders[i]) {
                throw new Error(`Header mismatch: Expected ${expectedHeaders[i]}, Found ${headerText}`);
            }
        }

        // Verify table rows and data
        let tableRows = await driver.findElements(By.css('table tbody tr'));
        console.log(`Number of incidents found: ${tableRows.length}`);
        if (tableRows.length === 0) {
            throw new Error('No incident rows found in the table');
        }

        // Interact with the first incident in the table
        let firstIncident = tableRows[0];
        let viewDetailsButton = await firstIncident.findElement(By.css('button'));
        await viewDetailsButton.click();

        // Wait for the modal to be displayed
        let modal = await driver.wait(until.elementLocated(By.css('.Updatemodal')), 30000);
        await driver.wait(until.elementIsVisible(modal), 30000);

        // Verify the modal content
        let modalTitle = await driver.findElement(By.css('.modal-title')).getText();
        console.log(`Modal Title: ${modalTitle}`);
        if (!modalTitle) {
            throw new Error('Modal title is missing');
        }

        // Check timeline items in the modal
        let timelineItems = await driver.findElements(By.css('.timeline-item-text'));
        let expectedTimelineStages = ["Reported", "Assigned", "In Progress", "Resolved"];
        for (let i = 0; i < timelineItems.length; i++) {
            let timelineText = await timelineItems[i].getText();
            console.log(`Expected: ${expectedTimelineStages[i]}, Found: ${timelineText}`);
            if (timelineText !== expectedTimelineStages[i]) {
                throw new Error(`Timeline stage mismatch: Expected ${expectedTimelineStages[i]}, Found ${timelineText}`);
            }
        }

        // Verify media in the modal
        let incidentImage = await driver.findElement(By.css('.incident-image'));
        let imageUrl = await incidentImage.getAttribute('src');
        console.log(`Incident Image URL: ${imageUrl}`);
        if (!imageUrl) {
            throw new Error('Incident image is missing');
        }

        // Close the modal
        let closeButton = await driver.findElement(By.css('.close'));
        await closeButton.click();

        // Verify the modal is closed
        await driver.wait(until.stalenessOf(modal), 30000);

        // Additional test to open and close the modal again to ensure consistency
        await viewDetailsButton.click();
        modal = await driver.wait(until.elementLocated(By.css('.Updatemodal')), 30000);
        await driver.wait(until.elementIsVisible(modal), 30000);
        closeButton = await driver.findElement(By.css('.close'));
        await closeButton.click();
        await driver.wait(until.stalenessOf(modal), 30000);

        console.log('All tests passed successfully');

    } catch (error) {
        console.error('Test failed with error:', error);
    } finally {
        // Close the browser at the end of the test
        await driver.quit();
    }
}

// Execute the test
runTest();
