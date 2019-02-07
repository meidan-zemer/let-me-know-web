import React,{CSSProperties} from 'react'
import BarLoader from 'react-spinners/ClipLoader';

interface props {
    text?:string;
}

const styles={
    loadContainer:{
        top:'50%' as CSSProperties['top'],
        left:'50%' as CSSProperties['left'],
        position: 'absolute' as CSSProperties['position'],
    },
    text:{
        marginTop:'-70%' as CSSProperties['marginTop'],
        marginLeft:'-50%' as CSSProperties['marginLeft'],
        position: 'absolute' as CSSProperties['position'],
        color:'gray'
    }
};

export  default (props:props) => {
    return (
        <div style={styles.loadContainer}>
            {props.text ? <h3 style={styles.text}>{props.text}</h3>: null}
            <BarLoader color={'#2089dc'}/>
        </div>
    );
}