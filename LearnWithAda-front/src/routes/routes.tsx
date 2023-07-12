import HomeContent from '../pages/home-content';
import TopicContent from '../pages/topic-content';
import SignUpContent from '../pages/sign-up-content';
import SignUpContentToken from '../pages/sign-up-content-token';
import SignInContent from '../pages/sign-in-content/';
import ForgotPassword from '../pages/forgot-password';
import TakeAssessmentContent from '../pages/take-assessment-content';
import LessonContent from '../pages/lesson-content';
import LessonEditContent from '../pages/lesson-edit-content';
import SingleLessonContent from '../pages/single-lesson-content';
import CourseCreateContent from '../pages/course-create-content';
import SingleCourseContent from '../pages/single-course-content';
import CourseContent from '../pages/course-content';
import DashboardContent from '../pages/dashboard-content';
import Course from '../pages/course-description';
import UserProfileContent from '../pages/user-profile-content';
import UserTopics from '../pages/user-topics';
import UserLessons from '../pages/user-lessons';
import Users from '../pages/users-content';
import NotificationContent from '../pages/notifications-content';
import UserGroup from '../pages/user-group';
import UserGroupCreate from '../pages/user-group-create';
import UserGroupProgress from '../pages/user-group-progress';
import UserBusinessCreate from '../pages/user-business-create';
import UserBusiness from '../pages/user-business';
import UserBusinessInvite from '../pages/user-business-invite';
import UserInvitedBusinesses from '../pages/user-invited-businesses';
import UserBusinessInfo from '../pages/user-business-info';
import LearnFromStreamContent from '../pages/learn-from-stream';
import { RoleTypes } from '../utils/constants';

export enum RoutePath {
    ROOT = '/topics',
    SIGNIN = '/signin',
    SIGNUP = '/signup',
    SIGNUP_TOKEN = '/signup/:token',
    FORGOT_PASSWORD = '/forgot',
    COURSE = '/course',
    TOPIC = '/topic/:id',
    TOPIC_EDIT = '/topic-edit/:id',
    TAKE_ASSESSMENT = '/lesson-assessment/:id',
    LESSON_EDIT = '/lesson-edit/:id',
    LESSON_CREATE = '/lesson-create',
    TOPIC_CREATE = '/topic-create',
    COURSE_CREATE = '/course-create',
    COURSE_EDIT_NAME = '/course-edit/:courseId',
    LESSON = '/topic/:topicId/lesson/:lessonId',
    COURSE_EDIT = '/course/:id',
    SINGLE_COURSE = '/single-course/:courseId',
    DASHBOARD = '/dashboard',
    LEARN = '/learn',
    LEARN_CONTENT = '/learn/:name',
    USERPROFILE = '/',
    USER_TOPICS = `/user-topics`,
    USER_LESSONS = '/user-lessons',
    USER_NOTIFICATIONS = '/user-notifications',
    USER_BUSINESSES = '/user-businesses',
    USERS = '/users',
    USER_GROUP = '/group',
    USER_GROUP_CREATE = '/group-create',
    USER_GROUP_CREATE_EXT = '/group-create/:id',
    USER_GROUP_PROGRESS = '/group-progress/:groupId',
    USER_BUSINESS_CREATE = '/business-create',
    USER_BUSINESS_CREATE_EXT = '/business-create/:id',
    USER_BUSINESS = '/business',
    USER_BUSINESS_INVITE = '/business/:id/invite',
    USER_BUSINESS_ACCEPT = '/business-accept',
    USER_BUSINESS_INFO = '/business/:id/info',
}

export const unauthorizedPages = [
    {
        key: 'signIn',
        label: 'Sign In',
        path: RoutePath.SIGNIN,
        content: <SignInContent />,
    },
    {
        key: 'signUp',
        label: 'Sign Up',
        path: RoutePath.SIGNUP,
        content: <SignUpContent />,
    },
    {
        key: 'signUp',
        label: '',
        path: RoutePath.SIGNUP_TOKEN,
        content: <SignUpContentToken />,
    },
    {
        key: 'forgot',
        label: '',
        path: RoutePath.FORGOT_PASSWORD,
        content: <ForgotPassword />,
    },
];

export const authorizedPages = [
    {
        key: 'learn',
        label: 'Learn from stream',
        path: RoutePath.LEARN,
        content: <LearnFromStreamContent />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: RoutePath.DASHBOARD,
        content: <DashboardContent />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'user-profile',
        label: 'Dashboard',
        path: RoutePath.USERPROFILE,
        content: <UserProfileContent />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'user-topics',
        label: 'Topics',
        path: RoutePath.USER_TOPICS,
        content: <UserTopics />,
        roles: [RoleTypes.USER],
    },
    {
        key: 'user-lessons',
        label: 'Lessons',
        path: RoutePath.USER_LESSONS,
        content: <UserLessons />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'course',
        label: 'Courses',
        path: RoutePath.COURSE,
        content: <CourseContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'single-course',
        label: '',
        path: RoutePath.SINGLE_COURSE,
        content: <Course />,
        roles: [RoleTypes.BUSINESS_ADMIN, RoleTypes.ADMIN, RoleTypes.USER],
    },
    {
        key: 'topics',
        label: 'Topics',
        path: RoutePath.ROOT,
        content: <HomeContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'topic',
        label: '',
        path: RoutePath.TOPIC_EDIT,
        content: <TopicContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'course-edit',
        label: '',
        path: RoutePath.COURSE_EDIT,
        content: <SingleCourseContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'course-edit-name',
        label: '',
        path: RoutePath.COURSE_EDIT_NAME,
        content: <CourseCreateContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'course-create',
        label: '',
        path: RoutePath.COURSE_CREATE,
        content: <CourseCreateContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'topic-create',
        label: '',
        path: RoutePath.TOPIC_CREATE,
        content: <TopicContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'lesson-edit',
        label: '',
        path: RoutePath.LESSON_EDIT,
        content: <LessonEditContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'lesson-create',
        label: '',
        path: RoutePath.LESSON_CREATE,
        content: <LessonEditContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'lesson',
        label: '',
        path: RoutePath.TOPIC,
        content: <LessonContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'take Assessment',
        label: '',
        path: RoutePath.TAKE_ASSESSMENT,
        content: <TakeAssessmentContent />,
        roles: [RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'single-lesson',
        label: '',
        path: RoutePath.LESSON,
        content: <SingleLessonContent />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'users',
        label: 'Users',
        path: RoutePath.USERS,
        content: <Users />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'notifications',
        label: '',
        path: RoutePath.USER_NOTIFICATIONS,
        content: <NotificationContent />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'group',
        label: 'Groups',
        path: RoutePath.USER_GROUP,
        content: <UserGroup />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'group-create',
        label: '',
        path: RoutePath.USER_GROUP_CREATE,
        content: <UserGroupCreate />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'group-create',
        label: '',
        path: RoutePath.USER_GROUP_CREATE_EXT,
        content: <UserGroupCreate />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'group-progress',
        label: '',
        path: RoutePath.USER_GROUP_PROGRESS,
        content: <UserGroupProgress />,
        roles: [RoleTypes.ADMIN],
    },
    {
        key: 'business',
        label: 'Businesses',
        path: RoutePath.USER_BUSINESS,
        content: <UserBusiness />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'business-invite',
        label: '',
        path: RoutePath.USER_BUSINESS_INVITE,
        content: <UserBusinessInvite />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'business-accept',
        label: '',
        path: RoutePath.USER_BUSINESS_ACCEPT,
        content: <UserInvitedBusinesses />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
    {
        key: 'business-info',
        label: '',
        path: RoutePath.USER_BUSINESS_INFO,
        content: <UserBusinessInfo />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'business-create',
        label: '',
        path: RoutePath.USER_BUSINESS_CREATE,
        content: <UserBusinessCreate />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'business-create',
        label: '',
        path: RoutePath.USER_BUSINESS_CREATE_EXT,
        content: <UserBusinessCreate />,
        roles: [RoleTypes.ADMIN, RoleTypes.BUSINESS_ADMIN, RoleTypes.USER],
    },
    {
        key: 'user-businesses',
        label: 'Invited Businesses',
        path: RoutePath.USER_BUSINESSES,
        content: <UserInvitedBusinesses />,
        roles: [RoleTypes.USER, RoleTypes.BUSINESS_ADMIN],
    },
];
