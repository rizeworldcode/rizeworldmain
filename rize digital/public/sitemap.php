<?php
/**
 * Root Sitemap Index Handler
 * Dynamically keeps sitemap-blogs.xml lastmod up to date in sitemap index
 */

@ini_set('display_errors', '0');
error_reporting(0);

$indexFile = __DIR__ . '/sitemap.xml';
$blogSitemapFile = __DIR__ . '/sitemap-blogs.xml';

$blogModDate = date('Y-m-d');
if (file_exists($blogSitemapFile)) {
    $blogModDate = date('Y-m-d', filemtime($blogSitemapFile));
}

// Canonical clean sitemap index generator
$getCleanIndex = function($blogDate) {
    return '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n" .
        '  <sitemap>' . "\n" .
        '    <loc>https://rizeworld.in/sitemap-pages.xml</loc>' . "\n" .
        '    <lastmod>2026-10-13</lastmod>' . "\n" .
        '  </sitemap>' . "\n" .
        '  <sitemap>' . "\n" .
        '    <loc>https://rizeworld.in/sitemap-services.xml</loc>' . "\n" .
        '    <lastmod>2026-10-13</lastmod>' . "\n" .
        '  </sitemap>' . "\n" .
        '  <sitemap>' . "\n" .
        '    <loc>https://rizeworld.in/sitemap-locations.xml</loc>' . "\n" .
        '    <lastmod>2026-10-13</lastmod>' . "\n" .
        '  </sitemap>' . "\n" .
        '  <sitemap>' . "\n" .
        '    <loc>https://rizeworld.in/sitemap-blogs.xml</loc>' . "\n" .
        '    <lastmod>' . $blogDate . '</lastmod>' . "\n" .
        '  </sitemap>' . "\n" .
        '  <sitemap>' . "\n" .
        '    <loc>https://rizeworld.in/sitemap-case-studies.xml</loc>' . "\n" .
        '    <lastmod>2026-10-13</lastmod>' . "\n" .
        '  </sitemap>' . "\n" .
        '</sitemapindex>';
};

$xmlContent = '';
if (file_exists($indexFile)) {
    $xmlContent = @file_get_contents($indexFile);
    // If the file on disk was corrupted or missing the blog loc tag, treat as empty
    if (!empty($xmlContent) && strpos($xmlContent, '<loc>https://rizeworld.in/sitemap-blogs.xml</loc>') !== false) {
        $xmlContent = preg_replace_callback(
            '/(<loc>https:\/\/rizeworld\.in\/sitemap-blogs\.xml<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/',
            function($matches) use ($blogModDate) {
                return $matches[1] . $blogModDate . $matches[2];
            },
            $xmlContent
        );
    } else {
        $xmlContent = '';
    }
}

// If empty or corrupted, regenerate and self-heal the file on disk
if (empty($xmlContent)) {
    $xmlContent = $getCleanIndex($blogModDate);
    @file_put_contents($indexFile, $xmlContent);
}

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=1800');
echo trim($xmlContent);
exit;
