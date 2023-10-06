import React from "react";


const CardTips = ({ text, onClick, className } : any) => {
    const style = className + " p-[2vh] w-[15vw] lg:min-h-[10vh] rounded-[1vh] bg-neutral-200 text-center cursor-pointer mx-auto max-lg:w-[90%] max-lg:h-full hover:bg-neutral-300";
    return (
        <div className={style} onClick={onClick}>
            <span className="flex flex-wrap h-full items-center justify-center text-neutral-800 text-sm">
                {text}  
            </span>
        </div>
    );
};

export default CardTips;