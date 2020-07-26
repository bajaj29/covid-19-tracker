import React from 'react';
import './InfoBox.css';
import { Card, CardContent, Typography } from '@material-ui/core';
import { prettyPrintStat } from './util';

function InfoBox({title, cases, isRed, active, total, ...props}) {
    return (
        <Card className={`infoBox ${active && "info--selected"} ${isRed && "info--red"}`} onClick={props.onClick}>
            <CardContent>
                <Typography className="info__title" color="testSecondary">{title}</Typography>
                <h2 className={`info__cases ${!isRed && "info--green"}`}>{prettyPrintStat(cases)}</h2>
                <Typography className="info__total" color="testSecondary">{prettyPrintStat(total)} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;
