export default function checkNationalNumber(nationalNumber) {
    nationalNumber = nationalNumber.toString()
    let falsArray = [
        '0000000000',
        '1111111111',
        '2222222222',
        '3333333333',
        '44444444444',
        '55555555555',
        '6666666666',
        '7777777777',
        '88888888888',
        '99999999999',
    ]
    if (falsArray.includes(nationalNumber)) return false
    nationalNumber = nationalNumber.split('')
    if (nationalNumber.length < 8  || nationalNumber.length > 10) return false

    if (nationalNumber.length != 10){
        for (let index = 0; index <= (10 - nationalNumber.length); index++) {
            nationalNumber.unshift('0')
        }
    }
    let sum = 0
    let controlNumber = parseInt(nationalNumber.splice(9,1)[0])
    for (let index = 0; index < nationalNumber.length; index++) {
        sum += parseInt(nationalNumber[index]) * (10 - index)
    }
    let remain = sum % 11
    if (remain < 2 && remain === controlNumber) return true
    if (remain >= 2 && (11 - remain) === controlNumber) return true
    return false
}