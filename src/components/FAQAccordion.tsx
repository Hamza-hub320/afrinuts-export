import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

const FAQAccordion: React.FC<{ items: FAQItem[] }> = ({ items }) => {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const toggleItem = (id: number) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {items.map(({ id, question, answer }) => (
                <div key={id} className="border-b border-gray-200">
                    <div
                        className="flex justify-between items-center py-3 cursor-pointer"
                        onClick={() => toggleItem(id)}
                    >
                        <h3 className="text-lg font-semibold">{question}</h3>
                        {openItem === id ? (
                            <FaChevronUp className="text-xl" />
                        ) : (
                            <FaChevronDown className="text-xl" />
                        )}
                    </div>
                    {openItem === id && <p className="text-gray-700">{answer}</p>}
                </div>
            ))}
        </div>
    );
};

export default FAQAccordion;