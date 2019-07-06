let lastCondition = false;

module.exports = {
    rem(a) {},
    push(a) {
        STACK.push(parseFloat(a))
    },
    pop(a) {
        STACK.shift()
    },
    mov(a) {
        if (ACCS[a[0]] !== undefined) ACCS[a[0]] = parseFloat(a[1])
    },
    ast(a) {
        if (ACCS[a[0]] !== undefined) {
            STACK.push(ACCS[a[0]])
        }
    },
    stl(_) {
        STACK.push(STACK.length)
    },
    deb(_) {
        console.log(STACK)
    },
    rev(_) {
        STACK = STACK.reverse()
    },
    str(a) {
        let joined = a.join(' ');
        for (let i of joined) {
            STACK.push(i.charCodeAt(0));
        }
    },
    och(a) {
        OUTBUFFER += String.fromCharCode(STACK[0])
    },
    add(_) {
        let a = STACK.shift()
        let b = STACK.shift()
        STACK.push(a + b)
    },
    sub(_) {
        let a = STACK.shift()
        let b = STACK.shift()
        STACK.push(a - b)
    },
    mul(_) {
        let a = STACK.shift()
        let b = STACK.shift()
        STACK.push(a * b)
    },
    div(_) {
        let a = STACK.shift()
        let b = STACK.shift()
        STACK.push(a / b)
    },
    mod(_) {
        let a = STACK.shift()
        let b = STACK.shift()
        STACK.push(a % b)
    },
    flr(a) {
        STACK.push(Math.floor(STACK.shift()))
    },
    ceil(a) {
        STACK.push(Math.ceil(STACK.shift()))
    },
    rnd(a) {
        STACK.push(Math.round(STACK.shift()))
    },
    abs(a) {
        STACK.push(Math.abs(STACK.shift()))
    },
    sin(_) {
        STACK.push(Math.sin(STACK.shift()))
    },
    cos(_) {
        STACK.push(Math.cos(STACK.shift()))
    },
    tan(_) {
        STACK.push(Math.tan(STACK.shift()))
    },
    out(a) {
        console.log(STACK[0]);
    },
    jmp(a) {
        PC = parseInt(a[0]);
    },
    clt(a) {
        lastCondition = (STACK[0] <  a[0])
    },
    cle(a) {
        lastCondition = (STACK[0] <= a[0])
    },
    cge(a) {
        lastCondition = (STACK[0] >= a[0])
    },
    cgt(a) {
        lastCondition = (STACK[0] >  a[0])
    },
    ceq(a) {
        lastCondition = (STACK[0] == a[0])
    },
    cne(a) {
        lastCondition = (STACK[0] != a[0])
    },
    call(a) {
        if (FUNCTIONS[a[0]]) {
            lastPc[lastPcPtr++] = PC
            lastFun[lastFunPtr++] = functionName
            functionName = a[0]
            interpret(FUNCTIONS[a[0]])
        }
    },
    ccal(a) {
        if (FUNCTIONS[a[0]] && lastCondition) {
            lastPc[lastPcPtr++] = PC
            lastFun[lastFunPtr++] = functionName
            interpret(FUNCTIONS[a[0]])
        }
    },
    ret(a) {
        //console.log(lastFun[lastFunPtr-1], lastFunPtr-1)
        if (lastPcPtr !== 0) {
            interpret(FUNCTIONS[lastFun[--lastFunPtr]], lastPc[--lastPcPtr])
        }
    },
    end(_) {
        STOP = true
    }
}