import puppeteer from 'puppeteer-core'
import fs from 'fs'
import { stringify } from 'csv-stringify/sync'

const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec))
const writeFile = (file, data) => fs.writeFile(`output/${file}`, data, err => {
  if (err) throw err
  console.log(`${file} writed.`)
})
const last_page = 88

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env['PUPPETEER_EXECUTABLE_PATH'],
  })
  const page = await browser.newPage()

  const header = [['店舗区分', '店舗名', '所在地', '地図URL', '業種', '主な取扱品']]

  let shops = []
  for (let i = 1; i <= last_page; i++) {
    await page.goto(`https://mito.inetcci.or.jp/voucher/index.php?p=${i}`)

    shops = shops.concat(await page.evaluate(() => {
      const shop_rows = Array.from(document.querySelectorAll('#framePremiumList table tbody tr'))
      return shop_rows.map(shop_row => {
        const shop = Array.from(shop_row.querySelectorAll('td'))
        const map = shop[2].querySelector('a')

        return [
          shop[0].textContent, // type
          shop[1].textContent, // name
          shop[2].textContent.replace('» 地図', ''), // address
          map ? map.getAttribute('href') : '',
          shop[3].textContent, // category
          shop[4].textContent, // product
        ]
      })
    }))

    console.log(`Page ${i} parsed.`)
    await sleep(500)
  }

  // 全店出力
  writeFile('shop_all.csv', stringify(header.concat(shops)))

  // 店舗区分別出力
  const types = new Set(shops.map(shop => shop[0]))
  types.forEach(v => {
    const filterd_shops = shops.filter(shop => shop[0] === v)
    writeFile(`shop_type_${v}.csv`, stringify(header.concat(filterd_shops)))
  })

  // 業種別出力
  const categories = new Set(shops.map(shop => shop[4]))
  categories.forEach(v => {
    const filterd_shops = shops.filter(shop => shop[4] === v)
    writeFile(`shop_category_${v}.csv`, stringify(header.concat(filterd_shops)))
  })

  await browser.close()
})()
