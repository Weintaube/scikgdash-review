'use client';
import TabbedCard from "../components/TabbedCard";

import Contributions from './Contributions';

export default function ContributionsContributors() {

    const tabs = [
        { 
          label: 'Contributions', 
          content: <Contributions/>,
        },
      ];

    return (
        <TabbedCard title={'Contributions to ORKG'} tabs={tabs}/>
    );
}