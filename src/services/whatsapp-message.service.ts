import {loadInvitees} from './invitee.service';

/**
 * Generates a formatted WhatsApp message with wedding details, payment instructions,
 * and pledge information.
 * @returns A promise that resolves to the formatted WhatsApp message
 */
export const generateWhatsAppMessage = async (): Promise<string> => {
    // Load all invitees data from the database
    const invitees = await loadInvitees();

    // Wedding details
    const weddingDate = '15/11/2025';
    const committeeMeetingDate = '~12/10/2025~';
    const committeeMeetingTime = '~1600~';
    const committeeMeetingLocation = 'Online (Whatsapp)';

    // Payment details
    const paymentInstructions = [
        {method: 'M-PESA', number: '0762228745', name: 'FRANK MATABA'},
        {method: 'TIGO-PESA/YAS', number: '0657471721', name: 'VICTOR NATALIS MATABA'},
        {method: 'NMB', number: '20810055844', name: 'VICTOR NATALIS MATABA'}
    ];

    // Base URL for the wedding website
    const baseUrl = 'https://vmataba.github.io/victors-wedding/';

    // Format payment instructions section with better spacing
    const paymentSection = paymentInstructions.map((payment, index) =>
        `${index + 1}.  ${payment.method} : ${payment.number} - ${payment.name}`
    ).join('\n\n');  // Add extra line between payment methods

    // Separator line (wider)
    const separator = '------------------------';

    const generateSeparatorLine = (length: number): string => '-'.repeat(length);

    // Format pledges section - only include those with pledges
    const pledgesSection = invitees
        .filter(invitee => invitee.pledgeAmount && invitee.pledgeAmount > 0)
        .sort((a, b) => (b.pledgeAmount || 0) - (a.pledgeAmount || 0)) // Sort by pledgeAmount in descending order
        .map((invitee, index) => {
            const paidAmount = invitee.paidAmount || 0;
            const pledgeAmount = invitee.pledgeAmount || 0;
            const balance = pledgeAmount - paidAmount;
            let status = '';
            
            // Determine status with emoji
            if (paidAmount >= pledgeAmount) {
                status = '✅ FULLY PAID';
            } else if (paidAmount > 0) {
                status = '⏳ PARTIAL PAID';
            } else {
                status = '⚠️ NOT PAID';
            }
            
            // Format with simple numbering and improved spacing
            return `${index + 1}.  *${invitee.name.trim()}*\n` +
                   `   📊  *Pledge* : TZS ${formatAmount(pledgeAmount)}\n` +
                   `   💵  *Paid* : TZS ${formatAmount(paidAmount)}\n` +
                   `   💰  *Balance* : TZS ${formatAmount(balance)}\n` +
                   `   🔔  *Status* : ${status}\n` +
                   `${separator}`;
        }).join('\n\n');

    // If no pledges are found, provide a message
    const pledgesContent = pledgesSection.length > 0
        ? pledgesSection
        : "No pledges have been registered yet.";

    // Build the complete message with enhanced formatting
    const message = `🎉 *Victor Mataba's Wedding* 🎉\n\n` +
        `Greetings! We are pleased to share this update regarding Victor's wedding preparations and your generous contributions. *You are welcome for pledges and contributions*. Thank you for your continued support.\n\n` +
        `------------------------\n` +
        `📅 *Wedding Date* : ${weddingDate}\n` +
        `------------------------\n` +
        `📋 *Next Committee Meeting*: ${committeeMeetingDate}\n` +
        `⏰ *Time*: ${committeeMeetingTime} hrs\n` +
        `📍 *Location*: ${committeeMeetingLocation}\n` +
        `------------------------\n` +
        `💰 *Payment Instructions* 💰\n` +
        `------------------------\n` +
        `${paymentSection}\n\n` +
        `🎁 *Pledges & Gifts* 🎁\n\n` +
        `${pledgesContent}\n\n` +
        `🌐 *Visit our wedding website*:\n` +
        `${baseUrl}\n\n` +
        `❤️ *Thank you for your support!* ❤️`;

    return message;
};

/**
 * Helper function to format numeric amounts with commas
 */
const formatAmount = (amount: number): string => {
    return amount.toLocaleString('en-US');
};
