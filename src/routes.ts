import { createPuppeteerRouter } from 'crawlee';

export const router = createPuppeteerRouter();

router.addDefaultHandler(async ({ enqueueLinks, log }) => {
    log.info(`Enqueueing new URLs`);
    // log.info(JSON.stringify(log));
    const enqueued = await enqueueLinks({
        globs: ['https://yellow.ai/**', 'https://*.yellow.ai/**', 'https://*.yellow.*/**'],
        label: 'detail',
        strategy: 'same-domain',
    });
    log.info('DefaultHandler Enqueued additional links from detail handler:', { enqueued });
});

function containsAny(substrings: string[], mainString: string) {
    return substrings.some((substring: string) => mainString.includes(substring));
}

const URL_KEYWORDS: string[] = [
    "privacy",
    "terms",
    "trust",
    "technical-specifications",
    "security",
    "compliance",
    "policy",
    "acceptable-use-policy",
    "acceptable_use_policy",
    "consent",
    "cookie",
    "policies",
    "legal",
]

router.addHandler('detail', async ({ request, page, log, pushData, enqueueLinks }) => {
    const title = await page.title();
    const content = await page.evaluate(() => document.body.innerText);
    
    log.info(`Processing ${title}`, { url: request.loadedUrl });

    if (containsAny(URL_KEYWORDS, request.loadedUrl)) {
        await pushData({
            url: request.loadedUrl,
            title,
            content,
        });
    
        const enqueued = await enqueueLinks({
            globs: ['https://yellow.ai/**', 'https://*.yellow.ai/**', 'https://*.yellow.*/**'],
            strategy: 'same-domain',
        });
    
        log.info('Enqueued additional links from detail handler:', { enqueued });
    }
});