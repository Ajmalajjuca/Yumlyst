import corn from 'cron'
import https from 'https'


const job = new corn.CronJob("*/14 * * * *", function ()  {
    https
    .get(process.env.API_URL, (res)=>{
        if(res.statusCode  === 200) console.log('GET request sent successfully')
        else console.log('GET request failed', res.statusCode)
    })
    .on('error', (err)=>{
        console.log('GET request failed', err.message)
    })
})
    

export default job