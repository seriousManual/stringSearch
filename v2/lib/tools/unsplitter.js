function unsplitter(list) {
    return list.reduce((carry, value, index) => {
        if (index == 0) {
            carry = value;
        } else {
            carry += value.slice(1);
        }

        return carry;
    }, '');
}

module.exports = unsplitter;