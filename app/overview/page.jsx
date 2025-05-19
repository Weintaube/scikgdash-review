import React from 'react';
import PredicatesDescription from './predicatesWithoutDescription/PredicatesDescription'
import ClassesDescirption from './classesWithoutDesription/ClassesDescription';

export default function Overview(){
  return(
    <div className='grid md:grid-cols-2'>
      <PredicatesDescription/>
      <ClassesDescirption/>
    </div>
  )
}

