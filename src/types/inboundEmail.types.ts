/**
 * Inbound email processing types.
 * @module types/inboundEmail
 */

/** Stored in Event.metadata for events created from inbound ICS emails */
export interface IcsEmailEventMetadata {
  source: 'ics_email';
  icsUid: string;
  icsSequence: number;
  organizerEmail: string;
}

/** Stored in Event.metadata for events created from AI email processing */
export interface AiEmailEventMetadata {
  source: 'ai_email';
  emailId: string;
  emailSubject: string;
  senderEmail: string;
  extractionLanguage: 'pl' | 'en';
  extractionModel: string;
  processedAt: string;
  pipelineVersion: string;
}
