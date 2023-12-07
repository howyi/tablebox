const domain = require("domain");
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['avatars.slack-edge.com'],
    }
}


module.exports = nextConfig
