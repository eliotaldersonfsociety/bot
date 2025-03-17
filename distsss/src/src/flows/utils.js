export const numberClean = (raw) => {
    const number = raw.toLowerCase().replace('mute', '').replace(/\s/g, '').replace('+', '');
    return number;
};
export default numberClean;
