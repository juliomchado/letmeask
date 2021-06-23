import  { ButtonHTMLAttributes } from "react";

import '../styles/button.scss';

type buttonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button(rest: buttonProps) {
    return (
        <button className="button" {...rest} />
    )
}