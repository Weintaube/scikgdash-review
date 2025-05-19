import {format} from 'date-fns';

export function formatDate(isoDate){
    if(!isoDate) return '';
    return format(new Date(isoDate), 'd MMMM yyyy');
}