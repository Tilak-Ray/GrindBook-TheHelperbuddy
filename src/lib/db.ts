import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  updateDoc, 
  doc, 
  serverTimestamp,
  increment,
  getDoc,
  setDoc,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { logger } from './logger';
import { toast } from 'sonner';

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

const handleFirestoreError = (error: any, operationType: any, path: string | null = null) => {
  const user = auth.currentUser;
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore Error',
    operationType,
    path,
    authInfo: user ? {
      userId: user.uid,
      email: user.email || '',
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      providerInfo: user.providerData.map(p => ({
        providerId: p.providerId,
        displayName: p.displayName || '',
        email: p.email || '',
      })),
    } : {
      userId: 'unauthenticated',
      email: '',
      emailVerified: false,
      isAnonymous: true,
      providerInfo: [],
    },
  };

  logger.error(`Firestore Operation Failed: ${operationType}`, errorInfo);

  if (error.code === 'permission-denied' || error.message?.includes('insufficient permissions')) {
    toast.error('Security Protocol Breach: Access Denied', {
      description: 'You do not have the required clearance for this operation.',
    });
    throw JSON.stringify(errorInfo);
  } else if (error.code === 'resource-exhausted') {
    toast.error('System Overload: Quota Exceeded', {
      description: 'The neural network is at capacity. Try again in the next cycle.',
    });
  } else {
    toast.error('Data Sync Failure', {
      description: error.message || 'The mesh network is experiencing interference.',
    });
  }

  return errorInfo;
};

import { db, auth } from './firebase';

// Users
export const getOrCreateUserProfile = async (user: any) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      const newUser = {
        uid: user.uid,
        displayName: user.displayName || 'Anonymous Grinder',
        photoURL: user.photoURL || '',
        stats: {
          level: 1,
          exp: 0,
          streak: 1,
          tasksCompleted: 0
        },
        createdAt: serverTimestamp()
      };
      await setDoc(userRef, newUser);
      logger.info('New user profile created', { uid: user.uid });
      
      // Developer Grant for Testing
      if (user.email === 'tilakraykurmi@gmail.com') {
        await updateDoc(userRef, {
          'inventory.steel': 150,
          'inventory.carbon': 150,
          'inventory.neon': 150,
          'stats.level': 25,
          'dev_grant_applied': true
        });
      }
      
      return newUser;
    }

    const data = userDoc.data();
    if (user.email === 'tilakraykurmi@gmail.com' && !data.dev_grant_applied) {
      await updateDoc(userRef, {
        'inventory.steel': 150,
        'inventory.carbon': 150,
        'inventory.neon': 150,
        'stats.level': 25,
        'dev_grant_applied': true
      });

      const tasks = [
        { content: 'Initialize Neural Citadel', priority: 'critical', completed: false },
        { content: 'Synchronize Connectivity Matrix', priority: 'urgent', completed: false },
        { content: 'Verify Tactical ID Protocol', priority: 'standard', completed: false }
      ];
      
      for (const task of tasks) {
         await addDoc(collection(db, 'users', user.uid, 'tasks'), {
           ...task,
           createdAt: serverTimestamp()
         });
      }

      await addDoc(collection(db, 'posts'), {
        authorId: user.uid,
        authorName: user.displayName || 'Lead Architect',
        authorPhoto: user.photoURL || '',
        content: 'NEURAL_BASE_ESTABLISHED // ALL SYSTEMS GREEN. READY FOR ARCHITECTURAL EXPANSION.',
        likesCount: 99,
        commentsCount: 0,
        createdAt: serverTimestamp()
      });
    }

    return userDoc.data();
  } catch (error) {
    handleFirestoreError(error, 'get', `users/${user.uid}`);
    return null;
  }
};

// Posts
export const createPost = async (userId: string, displayName: string, photoURL: string, content: string) => {
  try {
    return await addDoc(collection(db, 'posts'), {
      authorId: userId,
      authorName: displayName,
      authorPhoto: photoURL,
      content,
      likesCount: 0,
      commentsCount: 0,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'create', 'posts');
    throw error;
  }
};

export const subscribeToPosts = (callback: (posts: any[]) => void) => {
  try {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(q, 
      (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, 'list', 'posts');
      }
    );
  } catch (error) {
    handleFirestoreError(error, 'list', 'posts');
    return () => {};
  }
};

export const likePost = async (postId: string) => {
  try {
    const postRef = doc(db, 'posts', postId);
    return await updateDoc(postRef, {
      likesCount: increment(1)
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `posts/${postId}`);
    throw error;
  }
};

// Tasks
export const addTask = async (userId: string, title: string, priority: 'standard' | 'urgent' | 'critical' = 'standard') => {
  try {
    return await addDoc(collection(db, 'users', userId, 'tasks'), {
      userId,
      title,
      priority,
      completed: false,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'create', `users/${userId}/tasks`);
    throw error;
  }
};

export const subscribeToTasks = (userId: string, callback: (tasks: any[]) => void) => {
  try {
    const q = query(collection(db, 'users', userId, 'tasks'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, 
      (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, 'list', `users/${userId}/tasks`);
      }
    );
  } catch (error) {
    handleFirestoreError(error, 'list', `users/${userId}/tasks`);
    return () => {};
  }
};

export const toggleTask = async (userId: string, taskId: string, completed: boolean) => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    const taskSnap = await getDoc(taskRef);
    await updateDoc(taskRef, { completed });

    if (completed && taskSnap.exists()) {
      const taskData = taskSnap.data();
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const currentExp = data.stats.exp + 50;
        const currentLevel = data.stats.level;
        const nextLevelExp = currentLevel * 500;

        const blockType = taskData.priority === 'critical' ? 'carbon' : taskData.priority === 'urgent' ? 'neon' : 'steel';
        
        if (currentExp >= nextLevelExp) {
          await updateDoc(userRef, {
            'stats.exp': 0,
            'stats.level': increment(1),
            'stats.tasksCompleted': increment(1),
            [`inventory.${blockType}`]: increment(1)
          });
        } else {
          await updateDoc(userRef, {
            'stats.exp': increment(50),
            'stats.tasksCompleted': increment(1),
            [`inventory.${blockType}`]: increment(1)
          });
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, 'update', `users/${userId}/tasks/${taskId}`);
    throw error;
  }
};

export const updateBaseLayout = async (userId: string, layout: any[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    return await updateDoc(userRef, {
      'outpost.layout': layout,
      'outpost.lastUpdated': serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'update', `users/${userId}/outpost`);
    throw error;
  }
};

export const deleteTaskFromDB = async (userId: string, taskId: string) => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    return await deleteDoc(taskRef);
  } catch (error) {
    handleFirestoreError(error, 'delete', `users/${userId}/tasks/${taskId}`);
    throw error;
  }
};

// Roadmaps
export const subscribeToUserRoadmaps = (userId: string, callback: (roadmaps: any[]) => void) => {
  try {
    const q = query(collection(db, 'users', userId, 'roadmaps'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, 
      (snapshot) => {
        callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        handleFirestoreError(error, 'list', `users/${userId}/roadmaps`);
      }
    );
  } catch (error) {
    handleFirestoreError(error, 'list', `users/${userId}/roadmaps`);
    return () => {};
  }
};

export const addRoadmapToUser = async (userId: string, roadmap: any) => {
  try {
    return await addDoc(collection(db, 'users', userId, 'roadmaps'), {
      ...roadmap,
      userId,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, 'create', `users/${userId}/roadmaps`);
    throw error;
  }
};

export const updateModuleStatus = async (userId: string, roadmapId: string, moduleIndex: number, status: 'completed' | 'current' | 'locked') => {
  try {
    const roadmapRef = doc(db, 'users', userId, 'roadmaps', roadmapId);
    const roadmapSnap = await getDoc(roadmapRef);
    if (roadmapSnap.exists()) {
      const modules = [...roadmapSnap.data().modules];
      modules[moduleIndex].status = status;
      
      const completedCount = modules.filter(m => m.status === 'completed').length;
      const progress = Math.round((completedCount / modules.length) * 100);
      
      await updateDoc(roadmapRef, { modules, progress });
    }
  } catch (error) {
    handleFirestoreError(error, 'update', `users/${userId}/roadmaps/${roadmapId}`);
    throw error;
  }
};

// Profile update
export const updateUserProfile = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    return await updateDoc(userRef, data);
  } catch (error) {
    handleFirestoreError(error, 'update', `users/${userId}`);
    throw error;
  }
};
