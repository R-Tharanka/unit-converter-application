const { convert } = require('../utils/conversions');
const History = require('../models/History');

/**
 * Handles unit conversion requests.
 * Validated input is provided by middleware before reaching this controller.
 */
async function convertHandler(req, res) {
    try {
        // Extract validated values from request
        const { value, from, to, category, save } = req.validatedBody;

        // Perform the actual unit conversion
        const result = convert(value, from, to, category);

        // Prepare payload for response and optional persistence
        const payload = {
            value,
            from,
            to,
            category: category || inferCategory(from, to),
            result,
            meta: { note: 'server' }
        };

        // Save conversion to history only if requested
        let savedDoc = null;
        if (save) {
            savedDoc = await History.create(payload);
        }

        // Send successful response
        res.json({
            success: true,
            ...payload,
            savedId: savedDoc ? savedDoc._id : null
        });
    } catch (err) {
        // Catch conversion or validation-related errors
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

/**
 * Attempts to infer the unit category when it is not explicitly provided.
 * Falls back to 'unknown' if no matching category is found.
 */
function inferCategory(from, to) {
    const { categories } = require('../utils/conversions');

    // Check linear conversion categories first
    for (const cat in categories) {
        if (categories[cat].units[from] && categories[cat].units[to]) {
            return cat;
        }
    }

    // Special handling for temperature units
    const temps = ['C', 'F', 'K'];
    if (temps.includes(from) && temps.includes(to)) {
        return 'temperature';
    }

    return 'unknown';
}

module.exports = { convertHandler };
