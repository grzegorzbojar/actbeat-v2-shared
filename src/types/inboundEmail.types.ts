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
