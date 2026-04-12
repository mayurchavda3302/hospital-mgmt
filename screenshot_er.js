import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    console.log('Starting ER Diagram screenshot generation...');
    const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' });
    const page = await browser.newPage();
    
    // Set a big enough viewport
    await page.setViewport({ width: 2000, height: 2000, deviceScaleFactor: 2 });
    
    // Load the HTML file
    const filePath = `file://${path.join(__dirname, 'generate_er.html')}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });

    // Wait for mermaid to draw SVG
    await page.waitForSelector('.mermaid svg');

    // Get the element and its bounding box
    const element = await page.$('.mermaid svg');
    
    const imagePath = path.join(__dirname, 'project_diagrams', 'ER_Diagram.png');
    
    if (element) {
        await element.screenshot({ path: imagePath });
        console.log(`Saved screenshot to: ${imagePath}`);
    } else {
        console.error('Failed to find mermaid svg element.');
    }

    await browser.close();
})();
