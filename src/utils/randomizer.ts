export default function randomizer(length: number): string {
    // Alphabet list for random string
    const alphabet: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Create temp variable for storing result 
    let result: string = "";

    // Loop for given length times
    // Get random character using math random
    // Append to result
    for (let index = 0; index < length; index++) {
        const char = alphabet.charAt(Math.floor(Math.random() * alphabet.length));

        result += char;
    }

    return result;
}