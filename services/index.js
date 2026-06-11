/**
 * Unified Service Layer
 * Automatically switches between Appwrite and Demo mode based on configuration
 */

import { isAppwriteMode } from "../config/mode";

// Import Appwrite services
import {
    activityService as appwriteActivityService,
    authService as appwriteAuthService,
    campsiteService as appwriteCampsiteService,
    checklistService as appwriteChecklistService,
    commentService as appwriteCommentService,
    postService as appwritePostService,
    tripService as appwriteTripService,
} from "./appwriteService";

// Import Demo services
import {
    demoActivityService,
    demoAuthService,
    demoCampsiteService,
    demoChecklistService,
    demoCommentService,
    demoPostService,
    demoTripService,
} from "./demoService";

// Export the appropriate service based on mode
export const authService = isAppwriteMode()
  ? appwriteAuthService
  : demoAuthService;
export const campsiteService = isAppwriteMode()
  ? appwriteCampsiteService
  : demoCampsiteService;
export const postService = isAppwriteMode()
  ? appwritePostService
  : demoPostService;
export const commentService = isAppwriteMode()
  ? appwriteCommentService
  : demoCommentService;
export const activityService = isAppwriteMode()
  ? appwriteActivityService
  : demoActivityService;
export const tripService = isAppwriteMode()
  ? appwriteTripService
  : demoTripService;
export const checklistService = isAppwriteMode()
  ? appwriteChecklistService
  : demoChecklistService;
