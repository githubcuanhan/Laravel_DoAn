<?php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'auth/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000', // Development
        'https://dichvusieure.vercel.app', // Production
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];

