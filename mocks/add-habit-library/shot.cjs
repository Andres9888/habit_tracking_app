const puppeteer = require('puppeteer')

;(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] })
  const p = await b.newPage()
  await p.setViewport({ width: 800, height: 920, deviceScaleFactor: 2 })
  await p.goto('http://localhost:5199/', { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  const shot = (n) => p.screenshot({ path: `/tmp/mock-${n}.png` })

  await shot('1-add')

  await p.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Choose from Habit Library'))?.click())
  await new Promise((r) => setTimeout(r, 700))
  await shot('2-library')

  await p.evaluate(() => [...document.querySelectorAll('.tcard')].find((c) => c.textContent.includes('Read 20 minutes'))?.click())
  await new Promise((r) => setTimeout(r, 700))
  await shot('3-draft')

  await p.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Create')?.click())
  await new Promise((r) => setTimeout(r, 700))
  await shot('4-created')

  await b.close()
  console.log('done')
})()
