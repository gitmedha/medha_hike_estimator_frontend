import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { FaClipboardCheck, FaBlackTie, FaBriefcase, FaGraduationCap,  } from "react-icons/fa";
import Tooltip from "./Tooltip";

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 13,
    left: 'calc(-50% + 10px)',
    right: 'calc(50% + 10px)',
  },
  active: {
    '& $line': {
      backgroundColor:'#31b89d',
    },
  },
  completed: {
    '& $line': {
      backgroundColor:'#31b89d',
    },
  },
  line: {
    height: '10px',
    width: '100%',
    border: 0,
    backgroundColor: '#D3D3D3',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#949695',
    zIndex: 1000,
    color: '#fff',
    width: '35px',
    height: '35px',
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#257b69',
  },
  completed: {
    backgroundColor: '#257b69',
  },  
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <FaClipboardCheck size={20} />,
    2: <Tooltip color="#eeeff8" textColor="#6c6d78" placement="top" title= {<div>Certificate </div>} ><FaGraduationCap size={20} /></Tooltip>,
    3: <Tooltip color="#eeeff8" textColor="#6c6d78" placement="top" title= {<div>Internship </div>}><FaBlackTie size={20}/></Tooltip>,
    4: <FaBriefcase size={20} />,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}

    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& .MuiPaper-root': {
      paddingLeft: '0',
      paddingRight: '0',
    },
    '& .MuiStep-horizontal': {
      paddingLeft: '0',
      paddingRight: '0',
    },
    '& .MuiTypography-root': {
      fontFamily: 'Latto-Regular',
      color:'#808080',
    },
  },
}));

export default function ProgressBar({ activeStep, steps }) {
  const classes = useStyles();

  return (
    <div className={classes.root}> 
      <Stepper orientation="horizontal" alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label,index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
