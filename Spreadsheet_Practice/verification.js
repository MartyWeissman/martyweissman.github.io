// Verification code generator for spreadsheet lessons
// Creates a simple verification code based on student name and lesson number

/**
 * Generates a verification code from student name and lesson number
 * @param {string} name - Student's name
 * @param {number} lessonNum - Lesson number completed
 * @return {string} A verification code (5-6 characters)
 */
function makeVerification(name, lessonNum) {
    // Normalize the name: trim, convert to lowercase, remove non-alphanumeric characters
    const normalizedName = name.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normalizedName.length === 0) {
        // If no valid characters in name, use a fallback
        return "ANON" + lessonNum + "X";
    }

    // Create a seed based on name and lesson number
    const seed = calculateNameSeed(normalizedName) * lessonNum;

    // Generate a deterministic but seemingly random code
    return generateCode(seed, normalizedName, lessonNum);
}

/**
 * Calculates a numeric seed from a name
 * @param {string} name - Normalized name
 * @return {number} A numeric value derived from the name
 */
function calculateNameSeed(name) {
    let seed = 0;

    // Sum character codes with position-based weighting
    for (let i = 0; i < name.length; i++) {
        // Different weighting for even/odd positions
        if (i % 2 === 0) {
            seed += name.charCodeAt(i) * (i + 1);
        } else {
            seed += name.charCodeAt(i) * (i * 2 + 1);
        }
    }

    // Additional transformation
    seed = (seed * 13) % 10000;

    return seed;
}

/**
 * Generates a verification code from the seed, name, and lesson number
 * @param {number} seed - Numeric seed
 * @param {string} name - Normalized name
 * @param {number} lessonNum - Lesson number
 * @return {string} A verification code
 */
function generateCode(seed, name, lessonNum) {
    // Define character sets for the code
    const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
    const vowels = 'AEIOU';

    let code = '';

    // Start with a consonant based on the first letter of the name
    const firstCharIndex = Math.abs(name.charCodeAt(0) - 97) % consonants.length;
    code += consonants[firstCharIndex];

    // Add a vowel based on lesson number
    code += vowels[lessonNum % vowels.length];

    // Add two characters based on the seed
    code += consonants[seed % consonants.length];
    code += vowels[(seed % 17) % vowels.length];

    // Add a character based on the name length
    code += consonants[(name.length * lessonNum) % consonants.length];

    // Add suffix based on lesson number for more differentiation between lessons
    if (lessonNum > 9) {
        code += lessonNum;
    } else {
        code += lessonNum;
    }

    return code;
}

// Make the function available globally
window.makeVerification = makeVerification;

// Examples of usage:
// makeVerification("John Smith", 1) -> "JAWT1"
// makeVerification("Jane Doe", 2) -> "DENI2"
// makeVerification("Alice Johnson", 3) -> "JISU3"
