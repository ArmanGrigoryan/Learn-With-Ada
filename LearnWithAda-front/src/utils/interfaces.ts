import { CourseData } from '../core/models/course';
import { BusinessData } from '../core/models/business';
import { GroupData } from '../core/models/group';
import { DecodedToken, UserInterface } from '../core/models/user';
import { NotificationData } from '../core/models/notification';
import { LessonGet } from '../core/models/lesson';
import { AuthResult, BusinessMemberStatus, CourseStatus } from './constants';
import { TopicData } from '../core/models/topic';
import { BasicProps } from 'antd/lib/layout/layout';
import { DefaultThemeShadow } from '../core/base-layer';
import { RowProps } from 'antd';

//  All
export interface LoadInterface {
    [prop: string]: boolean;
}

//  Auth
export interface AuthSliceState {
    accessToken: string;
    refreshToken?: string;
    pending: boolean;
    result: AuthResult;
    emailErrorText: string;
    passwordErrorText: string;
}

export interface ResponseSignData {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
    role: string;
    accessToken: string;
}

//  Users
export interface UserPayloadInterface {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    data: any;
    error: boolean;
    message: string;
}

export interface RefreshPayload {
    userId: string;
    role: string;
    email: string;
    refreshToken: string;
}

export interface RefreshResponse {
    token: string;
    refreshToken: string;
    userId: string;
    firstName: string;
    lastName: string;
}

//  Businesses
export interface BusinessCreateData {
    id?: string;
    name: string;
    creator?: string;
}

export interface UpdateBusinessUserCourse {
    id: string;
    action: string;
    creator: string;
    courseId: string;
    userId: string;
}

export interface BusinessStateProps {
    businesses: Array<BusinessData>;
    revalidate: boolean;
    loading: boolean;
    loadUsers: LoadInterface;
}

export interface BusinessMembers {
    userId: string;
    status: string;
    token: string;
    email: string;
}

//  Courses
export interface initialCourseStateProps {
    courses: CourseData[];
    revalidate: boolean;
    loadUsers: LoadInterface;
    loadTopics: LoadInterface;
}

export interface TableCourseContentProps {
    loadUsers: LoadInterface;
    loadCourses: LoadInterface;
}

//  Topics
export interface TopicState {
    topics: TopicData[];
    revalidate: boolean;
    error: boolean;
}

export interface LessonMediaProps {
    type: string;
    children?: React.ReactElement;
    src?: string;
    endHandler?: () => void;
    width?: string;
    autoplay?: boolean;
}

//  Groups
export interface GroupCreateData {
    id: string;
    name: string;
    businessId: string;
    creator: string;
    courseIds?: Array<string>;
    userIds?: Array<string>;
    action?: string;
}

export interface UpdateGroupUserCourse {
    id: string;
    action: string;
    creator: string;
    courseId: string;
    userId: string;
}

export interface GroupStateProps {
    groups: Array<GroupData>;
    revalidate: boolean;
    loadGroups: LoadInterface;
    loadUsers: LoadInterface;
    loadCourses: LoadInterface;
    loading: boolean;
    totalProgress: Array<ProgressData>;
}

export interface ProgressData {
    courseId: string;
    progress: string;
    userCount: number;
    maxCount?: number;
}

export interface TableGroup {
    key: string;
    name: string;
    action: { isAdded?: boolean; onEdit?: (action: string) => void };
    dataSource: UserInterface[] | CourseData[];
}

export interface GroupTableProps {
    isCourse?: boolean;
    group: GroupData;
    loadObj: LoadInterface;
}

//  Notifications
export interface InitialNotificationData {
    notifications: NotificationData[];
    newNotifications: NotificationData[];
    count: number;
    newNotificationsCount: number;
    revalidate: boolean;
    loading?: boolean;
}

//  Components
export interface UrlParams {
    [prop: string]: string;
}

export type AppHeaderTab = {
    tabKey: string;
    tabLabel: string;
    routePath: string;
    onClick?: () => void;
};

export interface AppHeaderProps {
    mode?: 'only-logo' | 'navbar-tabs';
    onBurgerClick?: React.MouseEventHandler<HTMLSpanElement>;
    secondaryBackground?: boolean;
    tabs?: AppHeaderTab[];
    activeUnderlined?: boolean;
    clickable: boolean;
    onLogOutClick: () => void;
    userName: string;
    decodedToken: DecodedToken;
}

export interface BusinessProps {
    selected?: string | null;
    onBusinessSelect?: (val: string) => void;
}

export interface LessonsCardProps {
    lesson: LessonGet;
}

export interface NavbarProps {
    vertical?: boolean;
    tabs?: Record<string, { text: string; routePath?: string; extra?: React.ReactNode }>;
    selected?: string;
    secondaryBackground?: boolean;
    activeUnderlined?: boolean;
    mode?: 'horizontal' | 'inline';
    onItemClick?: () => void;
    onLogOutClick?: () => void;
    decodedToken?: DecodedToken;
}

export interface ModalProps {
    visible: boolean;
    submitHandler?: () => void;
    onCancel?: (visible: boolean) => void;
    name: string;
    type?: string;
}

export interface ProfileProps {
    userName?: string;
    clickable?: boolean;
    isAvatarShown?: boolean;
}

export interface SidebarProps {
    collapsed?: boolean;
    onClose?: () => void;
    userName: string;
    onLogOutClick?: () => void;
    tabs?: AppHeaderTab[];
}

export interface SliderProps {
    courseId?: string;
}

export interface TableItemTCC {
    key?: string;
    name?: string;
    user?: string;
    topic?: string;
    courseId?: string;
}

export interface TableItemTC {
    key: string;
    name: string;
    action: { isAdded?: boolean; onEdit?: () => void };
}

export interface CourseTableProps {
    courseId: string;
    isTopic?: boolean;
}

export interface TableItemTL {
    key: string;
    name?: string;
    action: string;
    topicId?: string;
    isOwn?: boolean;
}

export interface CourseTablePropsTL {
    lessons: LessonGet[];
}

export interface ColumnsTopics {
    title: React.ReactElement;
    dataIndex: string;
    render: unknown;
    sorter?: unknown;
}

export interface TableUsersPropsTopics {
    courseId?: string;
    editUsers?: boolean;
}

export interface TableItemTopics {
    key: string;
    name: string;
    status?: CourseStatus;
    progress?: CourseStatus;
    reminder?: string;
    courseId?: string;
}

export interface TableItemBusinessMembers {
    key: string;
    name: string;
    status: BusinessMemberStatus;
}

export interface TopicsPropsTopics {
    editable?: boolean;
    topics: TopicData[];
    topicId?: string;
}

export interface TopicPropsTopicsList {
    selected?: string | null;
    onTopicSelect?: (val: string) => void;
}

export interface BaseContentProps extends BasicProps {
    headContent?: React.ReactNode;
    className?: string;
}

/* eslint-disable-next-line */
export interface BaseLayerProps extends React.HTMLProps<HTMLDivElement> {
    shadow?: DefaultThemeShadow;
    head?: React.ReactNode;
}

export interface LabelValueProps extends RowProps {
    label?: React.ReactNode;
    value?: React.ReactNode;
}

export interface ColumnsUGP {
    title: React.ReactElement;
    dataIndex: string;
    render: unknown;
    sorter?: unknown;
}
export interface TableUsersPropsUGP {
    singleCourse?: string;
    editUsers?: boolean;
}

export interface TableItemUGP {
    id: string;
    key: string;
    name: string;
    status?: CourseStatus;
    progress?: CourseStatus;
    reminder?: string;
    courseId?: string;
    courseName?: string;
}

export interface CourseDataExtendedUGP extends CourseData {
    status: CourseStatus;
}
