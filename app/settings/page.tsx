"use client";

import { useState } from "react";

export default function SettingPage() {
    const [allergies, setAllergies] = useState("");
    const [difficulty, setDifficulty] = useState("easy");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 벡엔드에 사용자 정보 보내기
        alert(`알레르기: ${allergies}, 난이도: ${difficulty} 저장됨!`);
    }

    return (
    <div>
        <h1>설정 페이지</h1>
        <form>
            <label htmlFor="allergies">알레르기</label>
            <input type="text" id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            <label htmlFor="difficulty">난이도</label>
            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">초급</option>
                <option value="medium">중급</option>
                <option value="hard">고급</option>
            </select>

            <button type="submit" onClick={handleSubmit}>저장</button>
        </form>
    </div>);
}