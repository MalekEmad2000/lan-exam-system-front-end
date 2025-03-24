import React, { useEffect, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { IconContext } from 'react-icons';
import { isAdmin } from '../store/Authentication';
function MainNavigation() {

  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(sidebar);

  const [sidebarData, setSidebarData] = useState( [
    {
      title: 'Exams',
      path: '/home',
      icon: <AiIcons.AiFillHome />,
      cName: 'nav-text'
    },
    {
      title: 'Courses',
      path: '/Courses',
      icon: <IoIcons.IoIosPaper />,
      cName: 'nav-text'
    },
    {
      title: 'Question Bank',
      path: '/questionBank',
      icon: <FaIcons.FaList />,
      cName: 'nav-text'
    },
    isAdmin()?
    {
      title: 'Professors',
      path: '/professors',
      icon: <IoIcons.IoMdPeople />,
      cName: 'nav-text'
    } : null,
    {/*
      title: 'Support',
      path: '/support',
      icon: <IoIcons.IoMdHelpCircle />,
      cName: 'nav-text'
  */ }
  ]);

  useEffect(() => {
    setSidebarData(sidebarData);
  }, [isAdmin()]);

  
  

  return (
    <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            {sidebarData.map((item, index) => {
              if(!item) return;
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}


export default MainNavigation;