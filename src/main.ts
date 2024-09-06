import { PuppeteerCrawler, Dataset, log } from 'crawlee';
import { router } from './routes.js';
import { writeFileSync } from 'fs';

const startUrls = ['https://yellow.ai'];

const crawler = new PuppeteerCrawler({
    requestHandler: router,
    maxRequestsPerCrawl: 500,
    headless: true,
    maxConcurrency: 50,
});

await crawler.run(startUrls);

// Retrieve the dataset items
const data = await Dataset.getData();

// Generate markdown from the extracted data
let markdown = '';
data.items.forEach(item => {
    markdown += `## ${item.title} - ${item.url}\n\n`;
    markdown += `${item.content}\n\n`;
});

// Write the markdown to a file
writeFileSync('yellow.md', markdown);