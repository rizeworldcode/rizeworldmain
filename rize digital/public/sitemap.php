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

$xmlContent = '';
if (file_exists($indexFile)) {
    $xmlContent = @file_get_contents($indexFile);
    $xmlContent = preg_replace(
        '/(<loc>https:\/\/rizeworld\.in\/sitemap-blogs\.xml<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/',
        '$1' . $blogModDate . '$2',
        $xmlContent
    );
}

if (empty($xmlContent)) {
    $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n" .
        '  <sitemap><loc>https://rizeworld.in/sitemap-pages.xml</loc><lastmod>2026-10-13</lastmod></sitemap>' . "\n" .
        '  <sitemap><loc>https://rizeworld.in/sitemap-services.xml</loc><lastmod>2026-10-13</lastmod></sitemap>' . "\n" .
        '  <sitemap><loc>https://rizeworld.in/sitemap-locations.xml</loc><lastmod>2026-10-13</lastmod></sitemap>' . "\n" .
        '  <sitemap><loc>https://rizeworld.in/sitemap-blogs.xml</loc><lastmod>' . $blogModDate . '</lastmod></sitemap>' . "\n" .
        '  <sitemap><loc>https://rizeworld.in/sitemap-case-studies.xml</loc><lastmod>2026-10-13</lastmod></sitemap>' . "\n" .
        '</sitemapindex>';
}

header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=1800');
echo trim($xmlContent);
exit;
