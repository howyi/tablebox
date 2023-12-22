const domain = require("domain");
/** @type {import('next').NextConfig} */
const nextConfig = {
    // https://github.com/ueberdosis/tiptap/issues/4482#issuecomment-1819925409
    reactStrictMode: false,
    images: {
        domains: ['avatars.slack-edge.com'],
    }
}


module.exports = nextConfig
