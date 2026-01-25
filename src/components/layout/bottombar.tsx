import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import clsx from "clsx";
import useAuth from "@/hooks/useAuth";
import { ChartScatter, Home, Trophy, User } from 'lucide-react';
import type { MenuItem } from "@/types/interface";
import { MY_ROUTERS } from "@/types/contants";
import { isRouteMatch } from "@/utils/base";
//prettier-ignore
const list: MenuItem[] = [
    {
        id: 1,
        name: "HOME",
        img: "HOME",
        icon: Home,
        img_active: "HOME_ACTIVE",
        path: MY_ROUTERS.HOME,
        activePaths: [MY_ROUTERS.HOME]
    },
    {
        id: 2,
        name: "RESULT",
        icon: Trophy,
        img: "SCAN",
        img_active: "SCAN_ACTIVE",
        path: `/publisher`,
        activePaths: [`/publisher`, "/publisher/:slug"]
    },

    {
        id: 3,
        name: "BET",
        icon: ChartScatter,
        img: "DOC",
        img_active: "DOC_ACTIVE",
        path: `/bet/south`,
        activePaths: [`/bet/south`]
    },
    {
        id: 4,
        name: "ACCOUNT",
        icon: User,
        img: "DOC",
        img_active: "DOC_ACTIVE",
        path: "/login",
        activePaths: ["/login", "/history", "/history/detail/:id", "/history/folkgame", "/history/folkgame/detail/:id", "/report"]
    },

];

const ButtomMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, handleLogin } = useAuth();

    const isActive = (activePaths: string[]) => {
        // Kiểm tra xem current path có trong activePaths không
        if (activePaths.includes(location.pathname)) {
            return true;
        }
        return false;
    };
    const [activeItem, setActiveItem] = useState(2);

    const handleGoto = async (item: MenuItem) => {
        setActiveItem(item?.id);
        try {
            if (user) {
                return navigate(item?.path, { replace: true });
            } else {
                if (item?.path == MY_ROUTERS.HOME) {
                    return navigate(item?.path, { replace: true });
                } else {
                    return navigate(item?.path, { replace: true });
                }
            }
        } catch (error) {
            navigate(MY_ROUTERS.HOME, { replace: true });
        }
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-[#0b2c5f] h-14 md:hidden z-50 dark:bg-[rgb(3,3,40)] dark:text-amber-50 dark:shadow-[0_0_8px_rgb(6_80_254)] shadow-[0_0_5px_rgb(248_113_113)]">
                <div className="flex justify-around items-center w-full h-full">
                    {list.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleGoto(item)}
                                className={clsx(
                                    "menu__item flex flex-col items-center justify-center gap-1 text-white",
                                    { active: isRouteMatch(location.pathname, item.activePaths) }
                                )}
                            >
                                <Icon size={18} />
                                <span className="text-[10px] uppercase">{item.name}</span>
                            </button>
                        );
                    })}

                </div>
            </div>
        </>
    );
};

export default ButtomMenu;
