import { FaClipboardCheck, FaBlackTie, FaBriefcase, FaGraduationCap, FaUserGraduate, FaEdit } from "react-icons/fa";

export const studentStatusOptions = [
  {
    icon: <FaUserGraduate size={20} color="#31B89D" />,
    title: 'All',
    picklistMatch: '',
  },
  {
    icon: <FaEdit size={20} color="#31B89D" />,
    title: 'New Request',
    progress: '0%',
    picklistMatch: 'New Request',
  },
  {
    icon: <FaClipboardCheck size={20} color="#31B89D" />,
    title: 'Registered',
    progress: '25%',
    picklistMatch: 'Registered',
  },
  {
    icon: <FaGraduationCap size={20} color="#31B89D" />,
    title: 'Certified',
    progress: '50%',
    picklistMatch: 'Certified',
  },
  {
    icon: <FaBlackTie size={20} color="#31B89D" />,
    title: 'Internships',
    progress: '75%',
    picklistMatch: 'Internship Complete',
  },
  {
    icon: <FaBriefcase size={20} color="#31B89D" />,
    title: 'Placed',
    progress: '100%',
    picklistMatch: 'Placement Complete',
  },
]
