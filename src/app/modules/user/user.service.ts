import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { TStudent } from '../students/student.interface';
import { Student } from '../students/student.modal';

import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

// const createStudentIntoDB = async (password: string, payload: TStudent) => {
//   // create a user object
//   const userData: Partial<TUser> = {};

//   //if password is not given , use deafult password
//   userData.password = password || (config.default_password as string);

//   //set student role
//   userData.role = 'student';

//   // find academic semester info
//   const admissionSemester = await AcademicSemester.findById(
//     payload.admissionSemester,
//   );

//   //set  generated id
//   userData.id = await generateStudentId(admissionSemester);

//   // create a user
//   const newUser = await User.create(userData);

//   //create a student
//   if (Object.keys(newUser).length) {
//     // set id , _id as user
//     payload.id = newUser.id;
//     payload.user = newUser._id; //reference _id

//     const newStudent = await Student.create(payload);
//     return newStudent;
//   }
// };

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set  generated id
    userData.id = await generateStudentId(admissionSemester);

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a student
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a student (transaction-2)

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};
export const UserServices = {
  createStudentIntoDB,
};
