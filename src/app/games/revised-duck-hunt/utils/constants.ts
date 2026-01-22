// src/utils/constants.ts

export const WIDTH = 1100;
export const HEIGHT = 600;

export const DUCK_GLIDE_INDEX_LEFT = 2; // index for the left glide frame
export const DUCK_GLIDE_INDEX_RIGHT = 1; // index for the right glide frame
export const DUCK_FRAME_WIDTH = 30;
export const DUCK_FRAME_HEIGHT = 20;
export const DUCK_SPRITE_TOTAL_FRAMES = 4;
export const DUCK_DISPLAY_SIZE = 60;
export const DUCK_SPRITE_SRC = '/game/revise-duck-hunt/duck_flight_1.png';
export const DUCK_SPRITE_SRC_LEFT = '/game/revise-duck-hunt/duck_flight_left_1.png';
export const DUCK_SPRITE_STANDING_SRC = '/game/revise-duck-hunt/duck_standing.png'; // standing sprite for the duck
export const DUCK_SPRITE_STANDING_SRC_LEFT = '/game/revise-duck-hunt/duck_standing-left.png'; // standing sprite for the duck facing left
export const CLOUD_SKY_SRC = '/game/revise-duck-hunt/cloud_sky.png';
export const MOUNTAINS_SRC = '/game/revise-duck-hunt/mountains.png';
export const GREEN_HILLS_1_SRC = '/game/revise-duck-hunt/green_hills_1.png';
export const GREEN_FIELD_SRC = '/game/revise-duck-hunt/green_field.png';


export const DUCK_SPEED = 1;
export const DUCK_FLAP_VELOCITY_Y = -0.5; // upward velocity when flapping (spacebar pressed)
export const DUCK_INCLINE_ANGLE = Math.PI / 10; // angle for the upward incline (eg, 18 degrees)
export const GRAVITY = 0.005; // To simulate gravity effect on the duck's vertical movement
export const FLAP_DURATION_FRAMES = 60 * 2; // 1.5 seconds of flapping at 60 FPS

export const ANIMATION_SPEED = 20; // frames per second for the duck animation

// Boost constants
export const BOOST_MULTIPLIER = 2;
export const SUSTAINED_PRESS_THRESHOLD = 3000; // 1.5 seconds sustained press for boost
export const DOUBLE_TAP_THRESHOLD = 300; // 300ms for double tap detection
export const SHORT_BOOST_DURATION = 600; // 0.5 seconds for short boost

export const ANGLE_REDUCTION_RATE = GRAVITY / 5; // A new constant for angle deceleration