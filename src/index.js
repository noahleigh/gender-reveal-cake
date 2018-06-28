/* eslint-env browser */
import './index.css'
import emojiArray from './emoji.json'
import twemoji from 'twemoji'

/**
 * Test that string only contains a single supported emoji.
 * "Supported" means that twemoji can retrieve a single image for it.
 * @param {String} string - String to check for emoji
 * @returns {Bool}
 */
const testHasEmoji = (string) => {
  const parsed = twemoji.parse(string)
  // console.log(string)
  // console.log(parsed)
  const div = document.createElement('div')
  div.innerHTML = parsed
  return (div.textContent === '' && div.childElementCount === 1)
}

/**
 * Return a randomly chosen entry from `emojiArray` that is supported by twemoji.
 * @returns {Object} {char: <String>, descr: <String>}
 */
const selectValidEmoji = () => {
  let foundValidEmoji = false
  let index = null
  while (!foundValidEmoji) {
    index = Math.floor(Math.random() * emojiArray.length)
    foundValidEmoji = testHasEmoji(emojiArray[index].char)
    // if (!foundValidEmoji) {
    //   console.error('Emoji without image found: ', emojiArray[index])
    // }
  }
  return emojiArray[index]
}

const canvas = document.getElementById('canvas')
canvas.width = 500
canvas.height = 400
const ctx = canvas.getContext('2d')

/**
 * Cover the canvas with instances of an image.
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {HTMLImageElement} image - The image to fill the canvas with
 */
const fillCanvasWithImage = (ctx, image) => {
  ctx.save()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  for (let y = 0; y < ctx.canvas.height; y += image.height) {
    for (let x = 0; x < ctx.canvas.width; x += image.width) {
      ctx.drawImage(image, x, y)
    }
  }
  ctx.restore()
}

/**
 * Draws the text in large white lettering with black strokes in the center of the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas context
 * @param {String} text - The text to go on the canvas
 */
const drawBigCenteredText = (ctx, text) => {
  ctx.save()
  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'black'
  // ctx.shadowColor = 'black'
  // ctx.shadowBlur = 2
  ctx.font = 'bold 32px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width)
  ctx.strokeText(text, ctx.canvas.width / 2, ctx.canvas.height / 2, ctx.canvas.width)
  ctx.restore()
}

/**
 * Fill the canvas with a randomly chosen emoji
 */
const newEmoji = () => {
  const emoji = selectValidEmoji()
  // console.log(`Congrats! Your gender is ${emoji.descr.toUpperCase()}`)
  twemoji.parse(emoji.char, {
    callback: (icon, options, varient) => {
      const url = `${options.base}${options.size}/${icon}.png`
      const image = new Image(...options.size.split('x').map(val => Number.parseInt(val, 10)))
      image.src = url
      image.addEventListener('load', event => {
        fillCanvasWithImage(ctx, image)
        drawBigCenteredText(ctx, `It's a ${emoji.descr.toUpperCase()}!`)
      })
      // console.log('%c       ', `font-size: 100px; background: url(${url}) no-repeat;`)
    },
    onerror: (error) => console.error(error)
  })
}

drawBigCenteredText(ctx, "What's the baby's gender?")
const button = document.createElement('button')
button.textContent = 'Click for new gender'
button.addEventListener('click', newEmoji)
document.querySelector('main').appendChild(button)
