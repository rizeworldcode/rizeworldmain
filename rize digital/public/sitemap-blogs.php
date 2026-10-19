<?php
/**
 * Dynamic Blog Sitemap Proxy for Hostinger / LiteSpeed / Apache
 * Keeps https://rizeworld.in/sitemap-blogs.xml synced in real-time with backend blogs
 */

@ini_set('display_errors', '0');
error_reporting(0);

$cacheFile = __DIR__ . '/sitemap-blogs.xml';
$indexFile = __DIR__ . '/sitemap.xml';
$remoteUrl = 'https://rizeworldmain.onrender.com/sitemap-blogs.xml';
$cacheDuration = 1800; // 30 minutes cache

$forceRefresh = isset($_GET['refresh']);
$now = time();
$fileAge = file_exists($cacheFile) ? ($now - filemtime($cacheFile)) : 999999;

$xmlContent = '';
$fetched = false;

// Check if we need to refresh from backend
if ($forceRefresh || !file_exists($cacheFile) || $fileAge > $cacheDuration || filesize($cacheFile) < 100) {
    // Method 1: cURL (preferred for timeout control)
    if (function_exists('curl_init')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $remoteUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 8);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'RizeWorld-SitemapSync/1.0');
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && !empty($result) && strpos($result, '<urlset') !== false) {
            $xmlContent = $result;
            $fetched = true;
        }
    }

    // Method 2: file_get_contents fallback
    if (!$fetched && ini_get('allow_url_fopen')) {
        $ctx = stream_context_create([
            'http' => [
                'timeout' => 8,
                'header' => "User-Agent: RizeWorld-SitemapSync/1.0\r\n"
            ]
        ]);
        $result = @file_get_contents($remoteUrl, false, $ctx);
        if ($result && strpos($result, '<urlset') !== false) {
            $xmlContent = $result;
            $fetched = true;
        }
    }

    // If successfully fetched, update disk cache and root sitemap
    if ($fetched && !empty($xmlContent)) {
        @file_put_contents($cacheFile, $xmlContent);

        // Update lastmod of sitemap-blogs.xml in sitemap.xml
        if (file_exists($indexFile)) {
            $today = date('Y-m-d');
            $indexContent = @file_get_contents($indexFile);
            if ($indexContent) {
                // If corrupted or missing blog loc, self-heal cleanly
                if (strpos($indexContent, '<loc>https://rizeworld.in/sitemap-blogs.xml</loc>') === false) {
                    $updatedIndex = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
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
                        '    <lastmod>' . $today . '</lastmod>' . "\n" .
                        '  </sitemap>' . "\n" .
                        '  <sitemap>' . "\n" .
                        '    <loc>https://rizeworld.in/sitemap-case-studies.xml</loc>' . "\n" .
                        '    <lastmod>2026-10-13</lastmod>' . "\n" .
                        '  </sitemap>' . "\n" .
                        '</sitemapindex>';
                    @file_put_contents($indexFile, $updatedIndex);
                } else {
                    $updatedIndex = preg_replace_callback(
                        '/(<loc>https:\/\/rizeworld\.in\/sitemap-blogs\.xml<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/',
                        function($matches) use ($today) {
                            return $matches[1] . $today . $matches[2];
                        },
                        $indexContent
                    );
                    if ($updatedIndex && $updatedIndex !== $indexContent) {
                        @file_put_contents($indexFile, $updatedIndex);
                    }
                }
            }
        }
    }
}

// If remote fetch wasn't needed or failed, load from local disk cache
if (empty($xmlContent) && file_exists($cacheFile)) {
    $xmlContent = @file_get_contents($cacheFile);
}

// Absolute fallback if everything else fails
if (empty($xmlContent)) {
    $today = date('Y-m-d');
    $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" .
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n" .
        '  <url>' . "\n" .
        '    <loc>https://rizeworld.in/blogs</loc>' . "\n" .
        '    <lastmod>' . $today . '</lastmod>' . "\n" .
        '    <changefreq>weekly</changefreq>' . "\n" .
        '    <priority>0.8</priority>' . "\n" .
        '  </url>' . "\n" .
        '</urlset>';
}

// Serve as valid XML
header('Content-Type: application/xml; charset=UTF-8');
header('Cache-Control: public, max-age=' . $cacheDuration);
header('X-Sitemap-Source: ' . ($fetched ? 'live-backend' : 'disk-cache'));
echo trim($xmlContent);
exit;
