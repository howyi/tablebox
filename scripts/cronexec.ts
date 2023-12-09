
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
    const url = process.env.CRON_URL + '/api/cron?code=' + process.env.CRON_VERIFICATION_CODE
    const response = await fetch(url)
    console.log('CronJob completed')
}

main().catch((e) => {
    console.error('CronJob failed')
    console.error(e)
    process.exit(1)
});
