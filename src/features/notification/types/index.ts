export enum TypeNotification {
  MENTION = 'mention',
  COMMENT = 'comment',
  LIKE = 'like',
  DIS_LIKE = 'dislike',
  DAO_MEMBERSHIP_APPROVED = 'dao-membership-approved',
  DAO_MEMBERSHIP_REJECTED = 'dao-membership-rejected',
  INVITATION = 'invitation',
  UPDATE_MEMBER_ROLE = 'update-member-role',
  USER_FOLLOW = 'user-follow',
  REQUEST_JOIN_DAO = 'join-dao-request',
}

export enum TypeRoleNotification {
  USER = 'user',
  CONTRIBUTOR = 'contributor',
}

export interface INotification {
  createdAt: string;
  id: string;
  data: {
    type: TypeNotification;
    role: TypeRoleNotification;
  };
  from: {
    username: string;
    defaultAvatarIndex: number;
    avatar: {
      url: string;
    };
  };
}
