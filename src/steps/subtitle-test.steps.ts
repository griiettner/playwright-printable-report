import { Feature, Given, Scenario, Then, And } from '../fixtures';
import { appSubTitle } from '../shared/elements/app-create-title';

Feature('Sub-Title Component Test', ['subtitle'], async (fx) => {
  await Scenario('Test sub-title component displays correctly', async () => {
    await Given('The user visits a page with a sub-title component', async() => {
      // Set up the page content that matches the expected structure
      await fx.page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><title>Test Page</title></head>
        <body>
          <app-dynamic-page>
            <div class="sub-title mb-1">Policy Requirement</div>
            <p>This is a test page to verify the sub-title component works correctly.</p>
          </app-dynamic-page>
        </body>
        </html>
      `);
    });

    await Then('the user verify the policy requirement sub-title is visible and correct', async () => {
      // Test the sub-title using the simplified function
      await appSubTitle(fx, {
        text: 'Policy Requirement'
      });
    });

    await And('the user verify another sub-title with different text', async () => {
      // Update the page content for the second test
      await And('the user has updated the page content for second test', async () => {
        await fx.page.setContent(`
          <!DOCTYPE html>
          <html>
          <head><title>Test Page</title></head>
          <body>
            <app-dynamic-page>
              <div class="sub-title mb-1">Additional Information</div>
              <p>This tests different sub-title content.</p>
            </app-dynamic-page>
          </body>
          </html>
        `);
      });

      // Test with different text content
      await appSubTitle(fx, {
        text: 'Additional Information'
      });
    });
  });
});
