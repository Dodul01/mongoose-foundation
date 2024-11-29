import config from '../../config';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.modal';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // If password is not given use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';
  // menually generate id
  userData.id = '2030100001';

  // create a user
  const newUser = await User.create(userData); // build in static method

  // create a student
  if (Object.keys(newUser).length) {
    // set id , _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference _id

    const newStudent = await Student.create(studentData);

    return newStudent;
  }

  return newUser;
};

export const UserServices = {
  createStudentIntoDB,
};