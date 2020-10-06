import namor from 'namor'

const range = len => {
    const arr = []
    for(let i = 0; i < len; i++) {
        arr.push(i)
    }
    return arr
}

const newPerson = (columns) => {
    let result = {};
    range(columns).forEach((item, index) => {
        result[`column${index}`] = namor.generate({ words: 1, numbers: 0 })
        result['id'] = index;
    });
    return result;
}

export default function makeData(...lens) {
    const makeDataLevel = (depth = 0) => {
        const len = lens[depth]
        return range(len).map(d => {
            return {
                ...newPerson(lens[1]),
            }
        })
    }

    return makeDataLevel()
}
