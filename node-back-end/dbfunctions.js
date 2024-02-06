

export function calcMin(list)
{
    let result = Infinity;
    for (let i=0 ; list.length>i ; i++)
    {
        if (list[i].price < result)
        {
            result = list[i].price
        }

    }
    return (result != Infinity) ? result : 0;
}

export function calcMin2(list)
{
    let result = {price: Infinity};
    for (let i=0 ; list.length>i ; i++)
    {
        if (list[i].price < result.price)
        {
            result = list[i];
        }

    }
    return (result.price !== Infinity) ? result : {price: 0};
}

export function formatDecimal(price) {
    const dec = price - Math.floor(price);
    const decStr = dec.toFixed(2);
    return decStr.slice(2);
}

export function formatPrice(price) {
    const priceStr = Math.floor(price).toString();
    let formattedPrice = '';
    let index = priceStr.length - 1;
    let count = 0;

    while (index >= 0) {
        if (count === 3) {
            formattedPrice += '.';
            count = 0;
        }
        
        formattedPrice += priceStr[index];
        count += 1;
        index -= 1;
    }
    return formattedPrice.split('').reverse().join('');
}

export function turnToWildcard(str) {
    let result = ""
    for (let i = 0; str.length>i ; i++)
    {
        if (str[i] === ' ')
        {
            result += '%';
        }
        else result += str[i];
    }
    return '%' + result + '%';
}

export function checkInclude(list,name)
{
    for (let i=0 ; list.length>i ; i++)
    {
        if (list[i] === name)
        {
            return true;
        }
    }
    return false;
}

// module.exports = {
//     formatDecimal,
//     formatPrice,
//     calcMin,
//     turnToWildcard,
//     calcMin2,
//     checkInclude
// };
