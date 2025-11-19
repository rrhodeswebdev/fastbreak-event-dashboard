export const SPORT_TYPES = [
  'Basketball',
  'Soccer',
  'Baseball',
  'Football',
  'Volleyball',
  'Tennis',
  'Hockey',
  'Other',
] as const

export type SportType = (typeof SPORT_TYPES)[number]

export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'You must be logged in',
  EVENT_NOT_FOUND: 'Event not found',
  PERMISSION_DENIED: "You don't have permission to modify this event",
  EVENT_CREATE_FAILED: 'Failed to create event',
  EVENT_UPDATE_FAILED: 'Failed to update event',
  EVENT_DELETE_FAILED: 'Failed to delete event',
} as const

export const SUCCESS_MESSAGES = {
  EVENT_CREATED: 'Event created successfully!',
  EVENT_UPDATED: 'Event updated successfully!',
  EVENT_DELETED: 'Event deleted successfully!',
} as const

export const EVENT_SELECT_FIELDS =
  'id, name, sport_type, date_time, description, venues, created_at, updated_at, user_id' as const
