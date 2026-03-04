import { UserRole } from "./userroles";

type UserInfo = {
    user_id: string,
    user_name: string,
    user_role: UserRole
};

export { UserInfo };