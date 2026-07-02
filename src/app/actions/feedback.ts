'use server';

import { createClient } from '@/lib/supabase/server';

interface SubmitFeedbackParams {
  type: 'Issue' | 'Idea' | 'Other';
  message: string;
  pageUrl: string;
}

export async function submitFeedbackAction({ type, message, pageUrl }: SubmitFeedbackParams) {
  if (!message || message.trim().length === 0) {
    throw new Error('Message is required.');
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to submit feedback.');
  }

  const userEmail = user.email || 'Anonymous';

  // 1. Insert feedback into Supabase
  const { data, error } = await supabase
    .from('feedbacks')
    .insert([
      {
        user_id: user.id,
        user_email: userEmail,
        type,
        message: message.trim(),
        page_url: pageUrl,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase feedback insert error:', error);
    throw new Error(`Failed to save feedback: ${error.message}`);
  }

  // 2. Optional: Push notification to Slack Webhook if configured
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (slackWebhookUrl) {
    try {
      const typeEmoji = type === 'Issue' ? '🚨' : type === 'Idea' ? '💡' : '💬';
      const slackPayload = {
        text: `${typeEmoji} *New Space A Feedback [${type.toUpperCase()}]*`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${typeEmoji} New ${type} Submitted!`,
              emoji: true,
            },
          },
          {
            type: 'section',
            fields: [
              {
                type: 'mrkdwn',
                text: `*User:* ${userEmail}`,
              },
              {
                type: 'mrkdwn',
                text: `*Page:* \`${pageUrl}\``,
              },
            ],
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Feedback:*\n> ${message.trim().replace(/\n/g, '\n> ')}`,
            },
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: `Submitted at ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })} IST`,
              },
            ],
          },
        ],
      };

      await fetch(slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slackPayload),
      });
    } catch (slackErr) {
      console.error('Failed to post feedback to Slack webhook:', slackErr);
      // Non-blocking error: Database insertion already succeeded
    }
  }

  return { success: true, id: data.id };
}
