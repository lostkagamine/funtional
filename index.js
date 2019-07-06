const fs = require('fs')
const util = require('util')
const instructions = require('./instructions.js')

const filename = process.argv[2]
if (!filename) {
    console.log(`Usage: node ${process.argv[1]} <filename.fl>`)
    process.exit(1)
}
const inp = fs.readFileSync('./'+filename).toString()

const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

global.ACCS = {};
for (let i of alpha) {
    ACCS[i] = 0;
}
global.STACK = [];
global.PC = 0
global.STOP = false
global.FUNCTIONS = {}
global.OUTBUFFER = '';

let cycles = 0

const FUNRE = /\((\w+)(?: |\n)([\w\d\s\W]+?)(?:\n?)\)/gm
const ALTRE = /(\w+)(?: |\n)\{(?: |\n)([\w\d\s\W]+?)(?:\n?)\}/gm

const regToUse = FUNRE

const split = inp.split('\n')

let t
do {
    t = regToUse.exec(inp);
    if (t) {
        FUNCTIONS[t[1]] = t[2];
    }
} while (t)

global.lastPc = []
global.lastFun = []
global.lastPcPtr = 0
global.lastFunPtr = 0

global.functionName = ''

global.getLocation = function(val) {
    let reg = /S\[(\d+)\]/
    let h = reg.exec(val)
    if (h) {
        return parseFloat(h[1])
    } else {
        return parseFloat(val)
    }
}

global.interpret = function(code, pc) {
    let split = code.split('\n');
    STOP = false
    PC = pc || 0
    while (true) {
        if (STOP) return
        let cl = split[PC++]
        if (!cl) return
        if (cl.startsWith(':')) {
            continue
        }
        let sp = cl.trim().split(' ')
        let cmd = sp.shift().toLowerCase();
        if (instructions[cmd]) {
            instructions[cmd](sp)
        } else {
            console.error(`Unknown instruction ${cmd}.`);
            process.exit(0)
        }
        cycles++
    }
}

if (!FUNCTIONS['main']) {
    console.error('Main function doesn\'t exist.')
    process.exit(0)
}
functionName = 'main'
interpret(FUNCTIONS['main']);

console.log(`operation complete in ${cycles} cycles\nstack: ${util.inspect(STACK)}`)
if (OUTBUFFER !== '') console.log(OUTBUFFER)